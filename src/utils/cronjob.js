const cron = require('node-cron');
const {subDays, startOfDay, endOfDay} = require('date-fns');
const ConnectionRequest = require('../models/connectionRequest');
const sendEmail = require('../utils/sendEmail');

const cronJob = cron.schedule('0 8 * * *', async () => {
    
try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayTime = startOfDay(yesterday);
    const yesterdayEndTime = endOfDay(yesterday)

    const pendingRequests = await ConnectionRequest.find({
        status: 'interested',
        createdAt: {
            $gte: yesterdayTime,
            $lte: yesterdayEndTime
        }
    }).populate('fromUserId').populate('toUserId');

    const listOfEmails = [... new Set(pendingRequests.map((request) => {
        return request.toUserId.emailId;
    }))];

    console.log('List of emails:', listOfEmails);
    for (const email of listOfEmails) {
        const resp = await sendEmail.run('Pending Requests' + email, 'You have pending requests');
        console.log('Email sent to:', resp);
    }
} catch (err) {
    console.error('Error in cron job:', err);
}
})
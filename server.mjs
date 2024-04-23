import pkg from './firebaseConfig.mjs';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection,
    firebaseConfig
} = pkg;

import express from 'express';
import path from 'path';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const app = express();
const port = 3000;

app.use(express.static('firebaseConfig.mjs'));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let userSubscribed;
let user;

app.get('/firebase-config', (req, res) => {
  res.json({ firebaseConfig });
});

app.post('/user', async (req, res) => {
    const userId = req.body.userId;
    console.log('Received user ID:', userId);

    user=userId;

    try {
        const usersCollectionRef = collection(db, 'users');

        const querySnapshot = await getDocs(usersCollectionRef);

        let subscribed = false;

        const userDoc = querySnapshot.docs.find(doc => doc.id === userId);
        if (userDoc && userDoc.data().hasOwnProperty('subscribed')) {
            subscribed = userDoc.data().subscribed;
        } else {
            await setDoc(doc(db, 'users', userId), { subscribed: false }, { merge: true });
        }

        userSubscribed = subscribed;
        console.log('Subscribed:', subscribed);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error handling user:', error);
        res.status(500).send('Error handling user');
    }
});

app.get('/userSubscribed', (req, res) => {
  res.json({subscribed:userSubscribed});
});

const jobs = [];
addJobs();
async function addJobs() {
    try {
      const jobsCollection = collection(db, 'jobs');
      const snapshot = await getDocs(jobsCollection);
  
      snapshot.forEach(doc => {
        const company = doc.id;
        const jobData = doc.data().data.jobs;
  
        jobData.forEach(job => {
          jobs.push({
            title: job.title,
            location: job.location.name,
            company,
            absoluteUrl: job.absolute_url
          });
        });
      });
    } catch (error) {
      console.error('Error adding jobs:', error);
    }
  }
  
// Modify the /jobs endpoint to return a list of unique companies
app.get('/companies', async (req, res) => {
  try {
    const uniqueCompanies = [...new Set(jobs.map(job => job.company))];
    res.json(uniqueCompanies);
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ error: 'Failed to fetch company data' });
  }
});


app.post('/applications', async (req, res) => {
  const { url } = req.body;
  console.log('Received application URL:', url);

  const appliedJobs = jobs.filter(job => job.absoluteUrl === url)
                         .map(job => ({ ...job, status: 'Applied' }));

  const usersCollectionRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersCollectionRef);
  querySnapshot.forEach(async (doc) => {
    if (doc.id === user) {
      const userData = doc.data();
      const updatedAppliedJobs = [...(userData.appliedJobs || []), ...appliedJobs];
      await setDoc(doc.ref, { appliedJobs: updatedAppliedJobs }, { merge: true });
    }
  });
  res.sendStatus(200);
});

app.get('/appliedJobs', async (req, res) => {
  try {

      const userRef = collection(db, 'users');
      const querySnapshot = await getDocs(userRef);
      let appliedJobs;
      querySnapshot.forEach(async (doc) => {
        if (doc.id === user) {
          const userData = doc.data();
          appliedJobs = userData.appliedJobs || [];
        }
      });
      console.log(appliedJobs);
      res.json({ appliedJobs });

  } catch (error) {
      console.error('Error fetching applied jobs:', error);
      res.status(500).json({ error: 'Failed to fetch applied jobs' });
  }
});

// Modify the /jobs endpoint to handle company filter
app.get('/jobs', async (req, res) => {
  try {
    const jobTitle = req.query.job || '';
    const selectedCompany = req.query.company || '';
    const selectedLocation = req.query.location || '';

    let applications = [];
    const usersCollectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
    let appliedJobs;
    querySnapshot.forEach(async (doc) => {
      if (doc.id === user) {
      const userData = doc.data();
      appliedJobs = userData.appliedJobs || [];
    }
    });

    let filteredJobs = jobs.filter(job => !appliedJobs.some(appliedJob => appliedJob.absoluteUrl === job.absoluteUrl));

    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(jobTitle.toLowerCase())
    );

    if (selectedCompany) {
      filteredJobs = filteredJobs.filter(job =>
        job.company.toLowerCase() === selectedCompany.toLowerCase()
      );
    }

    if (selectedLocation) {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    res.json(filteredJobs);
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).json({ error: 'Failed to fetch job data' });
  }
});

app.put('/updateStatus', async (req, res) => {
  const {url, status } = req.body;
  console.log(url);
  console.log(status);
  try {
    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(userRef);

    querySnapshot.forEach(async (doc) => {
        if (doc.id === user) {
            const userData = doc.data();
            let updatedAppliedJobs = [];

            // Update appliedJobs array
            if (userData.appliedJobs) {
                updatedAppliedJobs = userData.appliedJobs.map(job => {
                    if (job.absoluteUrl === url) {
                        return { ...job, status: status };
                    }
                    return job;
                });
            }

            // Replace user document with modified appliedJobs array
            await setDoc(doc.ref, { appliedJobs: updatedAppliedJobs });

            res.status(200).json({ message: 'Job status updated successfully' });
        }
    });
} catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ error: 'Failed to update job status' });
}
});

app.post('/deleteJob', async (req, res) => {
  const { url } = req.body;
  try {
      const userRef = collection(db, 'users');
      const querySnapshot = await getDocs(userRef);

      querySnapshot.forEach(async (doc) => {
          if (doc.id === user) {
              const userData = doc.data();
              let updatedAppliedJobs = [];

              // Filter out the job with the specified URL
              if (userData.appliedJobs) {
                  updatedAppliedJobs = userData.appliedJobs.filter(job => job.absoluteUrl !== url);
              }

              // Replace user document with modified appliedJobs array
              await setDoc(doc.ref, { appliedJobs: updatedAppliedJobs });

              res.status(200).json({ message: 'Job deleted successfully' });
          }
      });
  } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: 'Failed to delete job' });
  }
});


app.post('/createPayment', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  // Create an order
  try {
      const order = await razorpay.orders.create({
          amount: amount * 100, // Razorpay expects amount in paisa
          currency,
          receipt
      });

      res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).send('Error creating order');
  }
});

// Route to handle payment success callback
app.post('/paymentSuccess', async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  // Verify the signature
  const generatedSignature = crypto.createHmac('sha256', 'RAZORPAY_KEY_SECRET').update(orderId + '|' + paymentId).digest('hex');
  if (generatedSignature === signature) {

      const userDocRef = doc(db, 'users', user);
      await setDoc(userDocRef, { subscribed: true });

      res.send('Payment successful');
  } else {
      // Payment failed
      res.send('Payment failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
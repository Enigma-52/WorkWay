
<div align="center">

## WorkWay

</div>

## Screenshots

![3B7EF26D-81AE-4130-9DAC-61A66FE7E0E0](https://github.com/Enigma-52/WorkWay/assets/95529619/dccafff9-6e7b-4e17-b9ec-950d3748b985)


![2DDB19EF-601D-4146-8125-7B7DAB8EFB8F](https://github.com/Enigma-52/WorkWay/assets/95529619/9dac6df4-50d3-4fab-8979-084b6b20d1cb)


![83EE7BF5-AABB-4B0E-9B45-6C79049B17AA](https://github.com/Enigma-52/WorkWay/assets/95529619/a398dbb6-0f75-4079-ad85-d24ca36996a1)


## Installation

1. Clone the repository:
```bash
git clone https://github.com/Enigma-52/WorkWay.git
```

2. Navigate to the project directory:
```bash
cd WorkWay
```

3. Install dependencies:
```bash
npm install
```

4. Create a '.env' file with the following structure:

```bash
RAZORPAY_KEY_ID: `Your_Razorpay_Key_ID_Here`
RAZORPAY_KEY_SECRET: `Your_Razorpay_Key_Secret_Here`

FIREBASE_API_KEY: `Your_Firebase_API_Key_Here`
FIREBASE_AUTH_DOMAIN: `Your_Firebase_Auth_Domain_Here`
FIREBASE_PROJECT_ID: `Your_Firebase_Project_ID_Here`
FIREBASE_STORAGE_BUCKET: `Your_Firebase_Storage_Bucket_Here`
FIREBASE_MESSAGING_SENDER_ID: `Your_Firebase_Messaging_Sender_ID_Here`
FIREBASE_APP_ID: `Your_Firebase_App_ID_Here`
FIREBASE_MEASUREMENT_ID: `Your_Firebase_Measurement_ID_Here`
```

5. Add this file to '.gitignore'

6. Start the server:
   ```bash
   node server.mjs
   ```
7. The server will be live at: http://localhost:3000
   
## Job Fetch

Create your '.env' file and add your necessary details to the file.

1. To fetch Jobs from Lever Company pages : 'node fetchLever.mjs'
2. To fetch Jobs from Greenhouse Company pages : 'node fetchGreenhouse.mjs'

## Contributing

Contributions are welcome! Please follow the guidelines below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add feature'`)
5. Push to the branch (`git push origin feature`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License.

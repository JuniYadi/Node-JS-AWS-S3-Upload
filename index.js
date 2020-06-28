const fs = require('fs')
const moment = require('moment')
const {
    v4: uuidv4
} = require('uuid');

// read file from directory and convert to base64
const file = fs.readFileSync('sample-image.png', { encoding: 'base64'})

// convert base64 to buffer
const buff = Buffer.from(file, 'base64')

// set name of file based on date with uuid
const dateMonth = moment().month()
const dateYear = moment().year()
const datePath = `${dateYear}/${dateMonth}/${uuidv4()}.png`

// Setup AWS SDK S3
AWS.config.update({
    credentials: {
        accessKeyId: '', // set IAM Access to S3
        secretAccessKey: '' // set IAM Access to S3
    },
    region: 'ap-southeast-1' // S3 Location
});

// s3 upload function
const s3Upload = (name, data, mime) => {
    return new Promise((resolve, reject) => {
        const S3 = new AWS.S3()
        const params = {
            ACL: 'public-read',
            Bucket: 'MYBUCKET', // S3 Bucket
            Body: data,
            Key: name,
            ContentType: mime
        }

        S3.upload(params, (err, data) => {
            if(err) {
                reject(err)
            }

            resolve(data)
        })
    })
}

// run s3 upload function
s3Upload(datePath, buff, 'image/png')
.then(res => {
    console.log(res)
})
.catch(err => {
    console.error(err)
})

// example result
// {
//     ETag: '"4f8e02ef2e156e1aafc87b59d93fb62d"',
//     Location: 'https://s3.ap-southeast-1.amazonaws.com/MYBUCKET/2020/5/5279a200-c07c-443f-b816-bd01f7ce4087.png',
//     key: '2020/5/5279a200-c07c-443f-b816-bd01f7ce4087.png',
//     Key: '2020/5/5279a200-c07c-443f-b816-bd01f7ce4087.png',
//     Bucket: 'MYBUCKET'
// }

const sgMail=require('@sendgrid/mail');
const senGridApiKey=process.env.SEND_GRID_API_KEY;
sgMail.setApiKey(senGridApiKey);

const sendWelcomeEmail=(email,name)=>{
   sgMail.send({
    to:email,
    from : 'ayush34csea20@bpitindia.edu.in',
    subject:'Thanks for joining in!',
    text:`Welcome to the app ${name}, let me know how you get along with the app`,
   }).then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}
const sendCancelEmail=(email,name)=>{
    sgMail.send({
     to:email,
     from : 'ayush34csea20@bpitindia.edu.in',
     subject:'sorry To see you go',
     text:`good bye ${name}, hope to see you sometime back soon`,
    }).then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
 }

module.exports={sendWelcomeEmail,
sendCancelEmail};
// sgMail.send({
//     to:'ayush052sharma@gmail.com',
//     from:'ayush34csea20@bpitindia.edu.in',
//     subject:'hello there',
//     text:'sojao babu',
// }).then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

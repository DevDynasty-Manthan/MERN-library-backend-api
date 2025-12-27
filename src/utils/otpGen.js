import crypto from 'crypto'

const otpGen = ()=>{
      OTP = crypto.randomInt(100000,100000)
      console.log(OTP);
      return OTP;
}
otpGen();
export default otpGen
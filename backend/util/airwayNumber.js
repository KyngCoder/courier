function generateUniqueAirwayNo() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
  
    let airwayNo = "AB";
  
    // Generate 8 random digits
    for (let i = 0; i < 8; i++) {
      const randomDigit = digits[Math.floor(Math.random() * digits.length)];
      airwayNo += randomDigit;
    }
  
    return airwayNo;
  }
  
  module.exports = generateUniqueAirwayNo
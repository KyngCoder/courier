const { UniqueNumberCounter } = require("../models");

// Generate unique member number
async function generateUniqueNumber() {
    const prefix = 'SPC';
  
    // Retrieve the current value from UniqueNumberCounter and increment it by 1
    let counterRecord = await UniqueNumberCounter.findOne();
  
    // If no counter record exists, create a new one with the initial counter value
    if (!counterRecord) {
      counterRecord = await UniqueNumberCounter.create({ counter: 0 });
    }
  
    const currentCounter = counterRecord.counter;
    const nextCounter = currentCounter + 1;
  
    // Pad the incremented value with leading zeros
    const paddedCounter = String(nextCounter).padStart(3, '0');
  
    // Generate the unique number by concatenating the prefix and the padded counter
    const uniqueNumber = prefix + paddedCounter;
  
    // Update the UniqueNumberCounter table with the next counter value
    await counterRecord.update({ counter: nextCounter });
  
    return uniqueNumber;
  }
  

  module.exports = generateUniqueNumber
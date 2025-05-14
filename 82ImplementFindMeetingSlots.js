function findMeetingSlots(schedules) {
    let flattenedSchedules = schedules.flat();
    // Sort schedule by start times
    flattenedSchedules.sort((a, b) => {
      return a[0] - b[0];
    })
    const output = [];

    // pick start from [start,end]
    let start = 0;
    for(let i=0;i<flattenedSchedules.length;i++){
      const flattenedSchedule = flattenedSchedules[i];
  
      if(flattenedSchedule[0] > start){
        output.push([start,flattenedSchedule[0]]);
      }
      start = Math.max(start,flattenedSchedule[1]);
    }
  
    // check for end condition from [start,end]
    if(start !== 24){
      output.push([start,24]);
    }
  
    return output;
  }

  console.log(findMeetingSlots([
      [[13,15], [11,12], [10,13]], //schedule for member 1
      [[8, 9]], // schedule for member 2
      [[13, 18]] // schedule for member 3
    ]))
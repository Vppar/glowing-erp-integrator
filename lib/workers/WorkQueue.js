function WorkQueue(queueRef, processingCallback) {
  this.processingCallback = processingCallback;
  this.busy = false;
  queueRef.startAt().limit(1).on("child_added", function(snap) {
    this.currentItem = snap.ref();
    this.tryToProcess();
  }, this);
}

WorkQueue.prototype.readyToProcess = function() {
  this.busy = false;
  this.tryToProcess();
}

WorkQueue.prototype.tryToProcess = function() {
  if(!this.busy && this.currentItem) {
    this.busy = true;
    var dataToProcess = null;
    var self = this;
    var toProcess = this.currentItem;
    this.currentItem = null;
    toProcess.transaction(function(theItem) {
      dataToProcess = theItem;
      if(theItem) {
        return null;
      } else {
        return;
      }
    }, function(error, committed, snapshot, dummy) {
       if (error) throw error;
       if(committed) {
         console.log("Claimed a job.");
	 self.processingCallback(dataToProcess, function() {
	   self.readyToProcess();
	 });
       } else {
         console.log("Another worker beat me to the job.");
	 self.readyToProcess();
       }
    });
  }
}

module.exports = WorkQueue;
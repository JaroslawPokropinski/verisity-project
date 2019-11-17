class Media {
  static getDevices() {
    return new Promise((resolve, reject) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return reject(new Error('Failed to get media devices'));
      }

      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const reducer = (accumulator, device) => {
          if (device.kind === 'audioinput') {
            accumulator.audio = true;
          }

          if (device.kind === 'videoinput') {
            accumulator.video = true;
          }
          return accumulator;
        };
        resolve(devices.reduce(reducer, { audio: false, video: false }));
      });
      return null;
    });
  }

  static getMedia(deviceInfo) {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices
        && navigator.mediaDevices.getUserMedia
        && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices
          .getUserMedia(deviceInfo)
          .then((stream) => {
            resolve(stream);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('Failed to get media devices'));
      }
    });
  }
}

export default Media;

function myFinally(promise, onFinally) {
  return promise
    .then((val) => {
      return Promise.resolve(onFinally()).then(() => val);
    })
    .catch((e) => {
      return Promise.resolve(onFinally()).then(() => Promise.reject(e));
    });
}

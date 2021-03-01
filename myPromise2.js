class myPromise {
    constructor(callback) {

        this.tempValue

        const resolve = (data) => {
            if (!this.reject) {
                this.resolve = data
                
                if (typeof this.resolve === 'undefined') {
                    this.resolve = {status: 'fulfilled', value: 'null'}
                }
                
            }
        }

        const reject = (error) => {
            if (!this.resolve) {
                this.reject = {status: 'rejected', value: new Error(error)}
                
                if (typeof this.reject === 'undefined') {
                    this.reject = {status: 'rejected', value: new Error(error)}
                }

            }
        }

        callback(resolve.bind(this), reject.bind(this))

        this.then = (cb2) => {
            const thisObj = this
            return new myPromise((resolve, reject) => {
                (function recurs () { 
                    try {
                        if (thisObj.resolve) {
                            const resolvedValue = cb2(thisObj.resolve)
                            if (resolvedValue instanceof myPromise) {
                                //about this - remember, in the then method called on line 110, the promise that is returned, is the returned value of the callback function, not the then() method, and where does the returning value of the callback function end up? Here!!
                                resolvedValue.then(value => {
                                    resolve(value) //You need to resolve because this promise (created on line 32) is the returned value of the then() method called on line 110, and if it is not resolved, you cannot effectively chain another .then method.
                                }).catch(e => {
                                    reject(e)
                                })
                                return
                            } else {
                                resolve(resolvedValue)
                                return
                            }
                        } 
    
                        if (thisObj.reject) {
                            reject(thisObj.reject) ;
                            return
                        }
    
                        setTimeout(() => {
                            recurs(cb2)
                        })

                    } catch(e) {
                        reject(e)
                    }
                })();  
                // recurs() //Check if making it an iife works!
            })
        }

        this.catch = (errorCB) => {
            if (this.reject) {
                return errorCB(this.reject)
            }

            setTimeout(() => {
                this.catch(errorCB)
            })
        }
    }
}

const myProm = new myPromise((resolve, reject) => {
    resolve(50)
})

myProm.then(data => {
    return data * 2
}).then(data => {

})

// const myP = new myPromise((resolve, reject) => {
//     resolve(4)
//     // reject(5)
// })


// myP.then((e) => {
//     console.log(e)
//     return 555
// }).then(e => {
//     console.log(e)
// })



const myP2 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('firstThen')
    }, 1000)
    // reject('error')
})

myP2.then(e => {
    // throw new Error('asd')
    console.log('first then call')
    // return new myPromise(resolve => {
    //     setTimeout(() => {resolve('second then')}, 1000)
    // })
    return new myPromise((resolve, reject) => {
        setTimeout(() => {reject('second then')}, 1000)
    })
}).then(e => {
    console.log(e)
    return 'third then'
}).then(e => {
    console.log(e)
}).catch(e => {
    console.log(e)
})



// .then(e => {
//     console.log(e)
// })
           







            // const thisObj = this // be able to access original object
        
            // class ThisProm {
                
            //     constructor() {
            
            //         (function () {
            //             try {

            //                 if (thisObj.resolve) {

            //                     thisObj.resolvedValue = cb2(thisObj.resolve)

            //                     if (typeof thisObj.resolvedValue != 'error') {
            //                         return new Promise(resolve => { resolve(thisObj.resolvedValue) })
            //                     }
            //                     throw new Error(cb2())
            //                 } 
            
            //                 if (thisObj.reject) {
            //                     return new myPromise(resolve, reject => { reject(thisObj.reject) });
            //                 }
            
            //                 setTimeout(() => {
            //                     thisObj.then(cb2)
            //                 })
            //             } 
            //             catch(e) {
            //                 thisObj.reject = e
            //             }
            //         })();

            //         this.then 
            //     }

            //     catch = (errorCB) => {
            //         try {
            //             if (thisObj.reject) {
            //                 errorCB(thisObj.reject);
            //                 return
            //             }

            //             setTimeout(() => {
            //                 thisObj.catch(errorCB)
            //             })

            //         } catch(e) {
            //             return errorCB(e)
            //         }   
            //     }
            // }

            // return new ThisProm()
        // }

    // }
// }
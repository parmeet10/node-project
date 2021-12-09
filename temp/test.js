setTimeout(() => {
    console.log('A');
}, 0);

setImmediate(() => {
    console.log('B');
});

process.nextTick(() => {
    console.log('C');
});

function getName() {
    return new Promise((resolve, reject) => {
        console.log('D');
        resolve('D');
    });
};

getName();
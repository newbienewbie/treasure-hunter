const path=require('path');

module.exports={
    entry:{
        main:path.join(__dirname,"lib/index.js"),
    },
    output:{
        path:path.join(__dirname,'dist/js'),
        filename:'[name].js',
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                include:[
                    path.resolve(__dirname,'lib'),
                ],
            },
        ],
    },
};
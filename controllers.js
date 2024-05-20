const { createExcelStream } = require("./excel");

const getRecords = async()=>{
    try{
        const filename = 'demo'
        const filePath = `./uploads/${filename}.xlsx`

        const data = {
            creator:"creator",
            lastModifiedBy:"lastModifiedBy",
            created: new Date(2021, 8, 30),
            modified: new Date(2021, 8, 30),
            lastPrinted: new Date(2021, 8, 30)
        }

        const rows = [
            { id: 4, name: 'Margaret', age: 32 },
            { id: 5, name: 'Margaret 1', age: 32 }
        ];

        const columns = [
            { header: 'Id', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Age', key: 'age' }
        ]

        await createExcelStream({
            data,
            filePath,
            rows,
            columns
        })

        return {
            filePath,
            filename
        }
    }
    catch(err){
        console.warn(err);
    }
}

const createRecord = async({
    files
})=>{
    try{
    const respose = await readExcelFile({filePath:files})
    return respose
    }
    catch(err){
        console.warn(err)
    }

}

module.exports={
    getRecords,
    createRecord
}
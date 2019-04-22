const mssql = require('mssql');
class ClinicDB {
    constructor(config) {
        this.config = config;
        this.pool = new mssql.ConnectionPool(config);
        //this.conn = await mssql.connect(this.config);
        this.connectionInProgress = false;
        this.conn = null;
    }//constructor
    async dbConn(){
        if (!this.connectionInProgress) {
            try {
                this.conn = await this.pool.connect();
                console.log('Connection in progress - '+this.config['server']);
                this.connectionInProgress = true;
            } catch (err) {
                console.error('Connection error', err);
            }
        }
    } //dbConn
    async dbQuery(queryStr) {
        //await this.conn; // ensures that the pool has been created
        try {
            const request = this.conn.request(); // or: new sql.Request(pool1)
            return(request.query(queryStr));
            //const result = await request.query(queryStr);
            //console.dir(result);
            //return result;
        } catch (err) {
            console.error('dbQuery error', err);
        }
    } //dbQuery
    kartGetList(searchStr) {
        let res = null;
        let queryStr = `SELECT [KARTA]
                  ,[FAM]
                  ,[IM]
                  ,[OTCH]
                  ,[DATR]
              FROM [KARTA] 
              WHERE [KARTA] like '${searchStr}';`;
        queryStr = `SELECT TOP 100
            [GRAFIK_ID]
            ,[REGISTR_ID]
            ,[KARTA]
            ,[FAM]
            ,[IM]
            ,[OTCH]
            ,[DATR]
        FROM [KARTA]
        WHERE KARTA LIKE '${searchStr}'
        ORDER BY [KARTA] DESC, FAM, IM, OTCH, DATR DESC;`;
        return(this.dbQuery(queryStr));
    }//kartGetList

    async kartGetLastNum(searchStr) {
        let res = null;
        const queryStr = `SELECT TOP 50
             [KARTA]
        FROM [KARTA]
        WHERE KARTA LIKE '${searchStr}'
        ORDER BY [registr_id] DESC;`;
        const kartList = await this.dbQuery(queryStr);
        //console.dir(kartList);
        res = 1;
        for (let kart of kartList['recordset']) {
            //console.dir(kart);
            let currNum = parseInt(kart.KARTA.replace(/\D+/g,""));
            res = Math.max(res, currNum);
        }//for
        console.log(`DB ${this.config.database} `+'kartGetLastNum='+res);
        return(res);
    }//kartGetLastNum

    async kartGetFreeNum(searchStr) {
        let max = 0;
        let min = 0;
        const resList = {};
        const queryStr = `SELECT TOP 50
             [KARTA]
        FROM [KARTA]
        WHERE KARTA LIKE '${searchStr.trim()}'
        ORDER BY [registr_id] DESC;`;
        const kartList = await this.dbQuery(queryStr);
        console.dir(kartList);
        //res = 1;
        for (let kart of kartList['recordset']) {
            let currNum = parseInt(kart.KARTA.replace(/\D+/g,""));
            resList[kart.KARTA.trim()]={KARTA:kart.KARTA.trim(),NUM:currNum};
            if (max == 0) max = currNum;
            if (min == 0) min = currNum;
            max = Math.max(max, currNum);
            min = Math.min(min, currNum);
        }//for
        console.dir(resList);
        console.log(`DB ${this.getDbName()} `+'kartGetFreeNum='+max);
        return(max);
    }//kartGetFreeNum

    async kartExists(searchStr) {
        let res = null;
        const queryStr = `SELECT TOP 2
             [KARTA]
        FROM [KARTA]
        WHERE KARTA LIKE '%${searchStr}%'
        ;`;
        const kartList = await this.dbQuery(queryStr);
        res = false;
        for (let kart of kartList['recordset']) {
               res = true;
        }
        return(res);
    }//kartExists

    getDbName() {
        return(this.config.database);
    }
}//ClinicDB

module.exports = ClinicDB;
const mssql = require('mssql');
class ClinicDB {
    constructor(config) {
        this.config = config;
        this.pool = new mssql.ConnectionPool(config);
        //this.conn = await mssql.connect(this.config);
        this.connectionInProgress = false;
        this.conn = null;
        this.primaryTableName = this.config['tableNameRegistr'];
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
            const request = this.conn. request(); // or: new sql.Request(pool1)
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
              FROM ${this.primaryTableName}
              WHERE upper([KARTA]) like upper('${searchStr}');`;
        queryStr = `SELECT TOP 100
            [GRAFIK_ID]
            ,[REGISTR_ID]
            ,[KARTA]
            ,[FAM]
            ,[IM]
            ,[OTCH]
            ,[DATR]
        FROM ${this.primaryTableName}
        WHERE upper(KARTA) LIKE upper('${searchStr}')
        ORDER BY [KARTA] DESC, FAM, IM, OTCH, DATR DESC;`;
        return(this.dbQuery(queryStr));
    }//kartGetList

    async kartGetLastNum(searchStr) {
        let res = null;
        const queryStr = `SELECT TOP 50
             [KARTA]
        FROM ${this.primaryTableName}
        WHERE upper(KARTA) LIKE upper('${searchStr}')
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

    async kartGetStartNum(searchStr, deepCount=10) {
        //Подобрать стартовый номер для начала поиска свободного диапазона или номера.
        let res = 0;
        let currNum = 0;
        const queryStr = `SELECT TOP ${deepCount}
             [KARTA]
        FROM ${this.primaryTableName}
        WHERE upper(KARTA) LIKE upper('${searchStr}%')
        ORDER BY [registr_id] DESC;`;
        const kartList = await this.dbQuery(queryStr);
        for (let kart of kartList['recordset']) {
            //console.log(kart.KARTA);
            currNum = parseInt(kart.KARTA.replace(/\D+/g,""));
            if (isFinite(currNum)) {
                if (res < 1) {
                    res = currNum*1;
                }
                res = Math.min(res, currNum);
            }
        }//for
        console.log(`DB ${this.config.database} `+'kartGetStartNum='+res);
        return(res);
    }//kartGetStartNum

    async kartGetFreeNum(inStr, startNum=0) {
        let inChar = inStr.trim()[0].toUpperCase();
        let notFound = true;
        //Let's find min num for starting search
        if (startNum < 2) {
            startNum = await this.kartGetStartNum(inChar);
        }
        let currNum = Math.max(startNum*1, 1);
        while (notFound && currNum < 10000) {
            let queryStr = `SELECT TOP 2
            [KARTA]
            FROM ${this.primaryTableName}
            WHERE upper(KARTA) LIKE upper('${inChar}%${''+('000'+Math.round(currNum,0)).slice(-4)}')
            ORDER BY [registr_id] DESC;`;
            console.log(queryStr);
            let kartList = await this.dbQuery(queryStr);
            //console.dir(kartList);
            if (kartList.rowsAffected[0]>0) {
                notFound = true;
                currNum += 1;
            } else {
                notFound = false;
            }
        }//while
        console.log(`DB ${this.getDbName()} `+'kartGetFreeNum='+currNum);
        return(currNum);
    }//kartGetFreeNum

    async kartExists(searchStr) {
        let res = null;
        const queryStr = `SELECT TOP 2
             [KARTA]
        FROM ${this.primaryTableName}
        WHERE upper(KARTA) LIKE upper('%${searchStr}%')
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
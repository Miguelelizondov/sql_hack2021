const { executeQuery } = require('../db/mysql');
const { failResponse, successReponse } = require('../scripts/response.js')

const alertsRecords = {
    /**
     * Function that handles a new Gps Record Entry.
     * @param {{"id": string, "start_hour": string, "end_hour": string}} record
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    handleEntry: async function (record) {
        record = {
            "id": record["id"],
            "start_hour": record["start_hour"] ,
            "end_hour": record["end_hour"]
        };
        const query = `SELECT * from Alerts where id_person = '${record['id']}'`;
        const result = await executeQuery(query);

        if (result.status == 1) {
            if (result.data.length == 0) {
                return this.create(record);
            } else {
                return this.update(record);
            }
        }
        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that creates a bike Gps Record.
     * @param {{"id": string, "start_hour": string, "end_hour": string}} newRecord
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    create: async function (newRecord) {
        newRecord = {
            "id_person": newRecord["id"],
            "start_hour": newRecord["start_hour"],
            "end_hour": newRecord["end_hour"]
        };

        const params = ["id_person", "start_hour","end_hour"];
        let paramsValues = [];
        for (let param of params) {
            if (!(param in newRecord)) {
                return failResponse("Missing Parameters", false);
            }
            paramsValues.push(`'${newRecord[param]}'`);
        }
        //const SocketIo = require('../helpers/SocketIo.js').SocketIo.getInstance();
        //SocketIo.io.sockets.emit(`update`, newRecord);

        const query = `INSERT INTO Alerts (${params.join(',')}) VALUES (${paramsValues.join(',')})`;
        console.log(query);
        const result = await executeQuery(query);
        if (result.status == 1) {
            return successReponse("Success", { "id_azure": newRecord['id_azure'] });
        }

        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that updates a bike Gps Record.
     * @param {{"id": string, "start_hour": string, "end_hour": string}} newRecord
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    update: async function (newRecord) {
        newRecord = {
            "id_person": newRecord["id"],
            "start_hour": newRecord["start_hour"],
            "end_hour": newRecord["end_hour"]
        };

        const params = ["id_person", "start_hour","end_hour"];
        let paramsValues = [];
        for (let param of params) {
            if (!(param in newRecord)) {
                return failResponse("Missing Parameters", false);
            }
            paramsValues.push(`'${newRecord[param]}'`);
        }
        //const SocketIo = require('../helpers/SocketIo.js').SocketIo.getInstance();
        //SocketIo.io.sockets.emit(`update`, newRecord);

        const setValues = params.map((param, index) => {
            return `${param} = ${paramsValues[index]}`
        });
        const query = `UPDATE Alerts SET ${setValues.join(', ')} WHERE id_person = '${newRecord['id_person']}';`;
        console.log(query);
        const result = await executeQuery(query);
        console.log(result)
        if (result.status == 1) {
            return successReponse("Success", { "id_person": newRecord['id_person'] });
        }

        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that get list of Gps Records.
     * @param {{ "id_person": ?string, "start_hour": ?string, "end_hour": ?string }} filters
     * @return {{"status": number, "msg": string, "data": any}}
     */
    getAll: function (filters) {
        const params = ["id_person", "start_hour", "end_hour"];
        const dbRelations = ["id_person", "start_hour", "end_hour"];
        const type = ["string", "string", "string"];
        let paramsValues = [];
        for (let index = 0; index < params.length; index++) {
            const param = params[index];
            const dbRelation = dbRelations[index];
            if (param in filters) {
                if (type[index] == "string") {
                    paramsValues.push(`${dbRelation} = '${filters[param]}'`);
                } else if (type[index] == "number_min") {
                    paramsValues.push(`${dbRelation} >= '${filters[param]}'`);
                } else if (type[index] == "number_max") {
                    paramsValues.push(`${dbRelation} <= '${filters[param]}'`);
                } else if (type[index] == "number") {
                    paramsValues.push(`${dbRelation} = '${filters[param]}'`);
                }
            }
        }
        let whereClause = '';
        if (paramsValues.length >= 1) {
            whereClause = `where ${paramsValues.join(" AND ")}`;
        }
        const query = `SELECT * FROM Alerts ${whereClause}`;
        console.log("where",query);
        return executeQuery(query);
    },
    /**
     * Function that get a record by bike Id.
     * @param {string} id 
     * @return {{"status": number, "msg": string, "data": any}}
     */
    getById: function (id) {
        if (!id) {
            return failResponse("Missing Parameters", false)
        }
        return this.getAll({ id_person: id })
    },
    /**
     * Function that delete a record by bike Id.
     * @param {string} id 
     * @return {{"status": number, "msg": string, "data": any}}
     */
    deleteById: function (id) {
        if (!id) {
            return failResponse("Missing Parameters", false)
        }
        const query = `DELETE from Alerts where id_person = '${id}'`
        return executeQuery(query)
    },
};

module.exports = alertsRecords;

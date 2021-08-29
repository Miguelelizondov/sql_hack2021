const { executeQuery } = require('../db/mysql');
const { failResponse, successReponse } = require('../scripts/response.js')

const personsRecords = {
    /**
     * Function that handles a new Gps Record Entry.
     * @param {{"id": string, "name": string}} record
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    handleEntry: async function (record) {
        record = {
            "id": record["id"] || null,
            "name": record["name"] || null
        };
        const query = `SELECT * from Persons where id_azure = '${record['id']}'`;
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
     * @param {{"id": string, "name": string}} newRecord
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    create: async function (newRecord) {
        newRecord = {
            "id_azure": newRecord["id"],
            "name": newRecord["name"] || ''
        };

        const params = ["id_azure", "name"];
        let paramsValues = [];
        for (let param of params) {
            if (!(param in newRecord)) {
                return failResponse("Missing Parameters", false);
            }
            paramsValues.push(`'${newRecord[param]}'`);
        }
        //const SocketIo = require('../helpers/SocketIo.js').SocketIo.getInstance();
        //SocketIo.io.sockets.emit(`update`, newRecord);

        params.push("registered_on");
        paramsValues.push(`'${new Date().toISOString().slice(0, 19).replace('T', ' ')}'`);
        const query = `INSERT INTO Persons (${params.join(',')}) VALUES (${paramsValues.join(',')})`;
        console.log(query);
        const result = await executeQuery(query);
        if (result.status == 1) {
            return successReponse("Success", { "id_azure": newRecord['id_azure'] });
        }

        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that updates a bike Gps Record.
     * @param {{"id": string, "name": string}} newRecord
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    update: async function (newRecord) {
        newRecord = {
            "id_azure": newRecord["id"],
            "name": newRecord["name"] || ''
        };

        const params = ["id_azure", "name"];
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
        const query = `UPDATE Persons SET ${setValues.join(', ')} WHERE id_azure = '${newRecord['id_azure']}';`;
        const result = await executeQuery(query);
        if (result.status == 1) {
            return successReponse("Success", { "id_azure": newRecord['id_azure'] });
        }

        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that get list of Gps Records.
     * @param {{ "id_azure": ?string, "name": ?string, "registered_on": ?string }} filters
     * @return {{"status": number, "msg": string, "data": any}}
     */
    getAll: function (filters) {
        const params = ["id_azure", "name", "registered_on"];
        const dbRelations = ["id_azure", "name", "registered_on"];
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
        const query = `SELECT * FROM Persons ${whereClause}`;
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
        return this.getAll({ id_azure: id })
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
        const query = `DELETE from Persons where id_azure = '${id}'`
        return executeQuery(query)
    },
};

module.exports = personsRecords;

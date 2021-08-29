const { executeQuery } = require('../db/mysql');
const { failResponse, successReponse } = require('../scripts/response.js')

const recordsRecords = {
    /**
     * Function that handles a new Gps Record Entry.
     * @param {{"id_person": string}} record
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    handleEntry: async function (record) {
        record = {
            "id": record["id"],
        };
        const query = `SELECT * from Records where id_person = '${record['id']}'`;
        const result = await executeQuery(query);

        if (result.status == 1) {
            return this.create(record);
        }
        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that creates a bike Gps Record.
     * @param {{"id": string}} record
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    create: async function (newRecord) {
        newRecord = {
            "id_person": newRecord["id"]
        };
        const timeTolerance = 3 * 60;

        const params = ["id_person"];
        let paramsValues = [];
        for (let param of params) {
            if (!(param in newRecord)) {
                return failResponse("Missing Parameters", false);
            }
            paramsValues.push(`'${newRecord[param]}'`);
        }
        //const SocketIo = require('../helpers/SocketIo.js').SocketIo.getInstance();
        //SocketIo.io.sockets.emit(`update`, newRecord);

        var query1 = "SELECT TIMESTAMPDIFF(SECOND , registered_on, CURRENT_TIMESTAMP( ) ) AS elapsed_time FROM Records ";
        query1 += "WHERE id_person = '"+newRecord["id_person"]+"' ORDER BY registered_on DESC LIMIT 1;"
        const resultquery = await executeQuery(query1);
        if (resultquery.data[0].elapsed_time >= timeTolerance){
            params.push("registered_on");
            paramsValues.push(`'${new Date().toISOString().slice(0, 19).replace('T', ' ')}'`);
            const query = `INSERT INTO Records (${params.join(',')}) VALUES (${paramsValues.join(',')})`;
            console.log(query);
            const result = await executeQuery(query);
            if (result.status == 1) {
                return successReponse("Success", { "id_azure": newRecord['id_azure'] });
            }else{
                return failResponse("Missing Parameters", false);
            }
        }else{
            return failResponse("Time Tolerance", false)
        }
    },
    /**
     * Function that updates a bike Gps Record.
     * @param {{"id": string}} record
     * @return {{"status": number, "msg": string, "data": {"id": string} | any}}
     */
    update: async function (newRecord) {
        newRecord = {
            "id_person": newRecord["id"]
        };

        const params = ["id_person"];
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
        const query = `UPDATE Records SET ${setValues.join(', ')} WHERE id_person = '${newRecord['id_person']}';`;
        const result = await executeQuery(query);
        if (result.status == 1) {
            return successReponse("Success", { "id_person": newRecord['id_person'] });
        }

        return failResponse("Missing Parameters", false);
    },
    /**
     * Function that get list of Gps Records.
     * @param {{ "id_row": ?string, "id_person": ?string, "registered_on": ?string }} filters
     * @return {{"status": number, "msg": string, "data": any}}
     */
    getAll: function (filters) {
        const params = ["id_row", "id_person", "registered_on"];
        const dbRelations = ["id_row", "id_person", "registered_on"];
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
        const query = `SELECT * FROM Records ${whereClause}`;
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
        const query = `DELETE from Records where id_row = '${id}'`
        return executeQuery(query)
    },
};

module.exports = recordsRecords;

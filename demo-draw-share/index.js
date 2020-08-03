module.exports = async function (context, req) {

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name) + ' // ' + context.bindingData.text
        };
    }
    else {
        context.res = {
            status: 200,
            body: "OK. But please pass a name on the query string or in the request body // " + context.bindingData.text
        };
    }
};
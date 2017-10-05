# Get By Meaning Functionality

## Basic Information

You can ask the server to give you the description and source code of a function by providing the desired inputs and outputs. To do that you must send a POST request to `gbm/search` with an object that contains the desired parameters in the body of the request. Note that in order to get a correct result, the relevant function in the database must have exactly the same parameters. For example if it returns `time` in `seconds` you must explicitly ask `time` in `seconds`. The result will be in JSON format. If the requested function does not exist the server will send an appropriate message and a *status code* `418`. What the server knows for each function is documented [here](../MODELS.md).

## `params` Object

The full format of the object that should be included in the request is below:

``` javascript
{
  "inputNodes": ['node1', 'node2'[, ...]],
  "inputUnits": ['unit1', 'unit2'[, ...]],
  "outputNodes": ['node1', 'node2'[, ...]],
  "outputUnits": ['unit1', 'unit2'[, ...]]
}
```

If any of the above isn't applicable, for example if you ask for a function with no inputs, it can be omitted.

>Note that this *must* in the `body` of the request.

## Example

``` javascript
var request = require('request');
var uri = 'https://call-by-meaning.herokuapp.com/gbm/search';
var params = {
  "inputNodes": "date",
  "inputUnits": "date",
  "outputNodes": "time",
  "outputUnits": "seconds"
};
var req = request.post(uri, {form: params}, function (err, response) {
  // Insert code here...
});
```
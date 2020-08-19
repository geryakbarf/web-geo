const baseKeyValSchema = {
    name: String,
    value: String,
    options: Schema.Types.Mixed
}

const baseTypeValSchema = {
    name: String,
    value: String,
    options: Schema.Types.Mixed
}

module.exports = {
    baseKeyValSchema,
    baseTypeValSchema
}
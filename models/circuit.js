var mongoose = require('./../config/db-config');

CircuitSchema  = mongoose.Schema(
    {
      users:[Array],
      circuit_boundaries: [Number],
      challenges:[{
        //order challenges by distance in getChallengeList?
        object_gate: String,
        location_gate: {
          position: [Number],
          name: String,
          address: String,
          category: String
        },
        id_users_completed: [Number]
      }],
      time_started: Date,
      time_completed: Date,
      date_created: Date,
      date_deleted: Date,
      archived: Boolean,
      delete_in_ten_days: {
        delete: Boolean,
        start_delete: Date
        }
    },
    { collection: 'circuits' });
var Circuit = mongoose.model('Circuit', CircuitSchema);

module.exports = Circuit;
import Message from './Message';
import Part from './Part';
import ResetCode from './ResetCode';
import Sale from './Sale';
import Server from './Serves';
import User from './User';

// One user can send many messages
User.hasMany(Message, { foreignKey: 'senderId' });
// One user can receive many messages
User.hasMany(Message, { foreignKey: 'receiverId' });

// Message belongs to both sender and receiver
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

// One user can have multiple reset codes
User.hasMany(ResetCode, { foreignKey: 'email' });
ResetCode.belongsTo(User, { foreignKey: 'email' });

// Each sale is associated with one part
Sale.belongsTo(Part, { foreignKey: 'partId' });
// One part can be associated with many sales
Part.hasMany(Sale, { foreignKey: 'partId' });

// Many-to-many relationship between User and Server
User.hasMany(Server, { foreignKey: 'userId' });
Server.belongsTo(User, { as: 'user', foreignKey: 'userId' });

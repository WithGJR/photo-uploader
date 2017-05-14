module.exports = function (sequelize, DataTypes) {
    var Thumbnail = sequelize.define('thumbnail', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        filename: DataTypes.STRING,
        width: { type: DataTypes.INTEGER, allowNull: false },
        height: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        freezeTableName: true,
        underscored: true,
        getterMethods: {
            url: function () {
                return '/assets/images/' + this.getDataValue('filename');
            }
        }
    });
    
    Thumbnail.associate = ({ Photo }) => {
        Thumbnail.belongsTo(Photo);
    };

    return Thumbnail;
};
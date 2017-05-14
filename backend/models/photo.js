module.exports = function (sequelize, DataTypes) {
    var Photo = sequelize.define('photo', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        filename: DataTypes.STRING,
        public: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        freezeTableName: true,
        underscored: true,
        getterMethods: {
            url: function() {
                return '/assets/images/' + this.getDataValue('filename');
            }
        }
    });

    Photo.associate = ({ Thumbnail }) => {
        Photo.hasMany(Thumbnail);
    };

    return Photo;
};
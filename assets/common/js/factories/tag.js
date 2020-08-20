uvodApp.factory("TagFactory", function ($http, User) {
    return {
        getTags: function (filters) {
            return $http.post('index.php/api/tag/list', filters).then(function (result) {
                var tagResponse = []
                if (result.data.content) {
                    tagResponse = result.data.content.entries ? result.data.content.entries : [];
                }

                for (i = 0; i < tagResponse.length; i++) {
                    tagResponse[i].id = tagResponse[i]._id;
                    tagResponse[i].createdAt = tagResponse[i].added;
                    delete tagResponse[i]._id;
                    delete tagResponse[i].updatedByUserId;
                    delete tagResponse[i].updated;
                    delete tagResponse[i].global;
                    delete tagResponse[i].addedByUserId;
                    delete tagResponse[i].added;
                    delete tagResponse[i].accountId;
                }
                return tagResponse;
            }).catch(function (err) {
                return null;
            })
        },
        createTag: function (data) {
            return $http.post('index.php/api/tag/create', data).then(function (result) {
                const tagResponse = result.data.content;
                tagResponse.id = tagResponse._id;
                tagResponse.createdAt = tagResponse.added;
                delete tagResponse._id;
                delete tagResponse.updatedByUserId;
                delete tagResponse.updated;
                delete tagResponse.global;
                delete tagResponse.addedByUserId;
                delete tagResponse.added;
                delete tagResponse.accountId;
                return tagResponse;
            }).catch(function (err) {
                return null;
            })
        },
        deleteTag: function (id) {
            return $http.post('index.php/api/tag/delete', {
                reference_id: id,
                user_id: User._id
            }).then(function (result) {
                return result.data.content;
            }).catch(function (err) {
                return null;
            })
        }
    }
});
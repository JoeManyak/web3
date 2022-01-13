class requester {
    URL = "https://web3-app3.herokuapp.com/v1/graphql"
    async fetchGraphQL(operationsDoc, operationName, variables) {
        const result = await fetch(
            this.URL,
            {
                method: "POST",
                body: JSON.stringify({
                    query: operationsDoc,
                    variables: variables,
                    operationName: operationName
                })
            }
        );

        return await result.json();
    }
    fetchMyQuery(operationsDoc) {
        return this.fetchGraphQL(
            operationsDoc,
            "MyQuery",
            {}
        );
    }

    async startFetchMyQuery(operationsDoc) {
        const {errors, data} = await this.fetchMyQuery(operationsDoc);

        if (errors) {
            // handle those errors like a pro
            throw new Error(errors[0].message);
        }

        // do something great with this precious data
        return data
    }

    executeMyMutation(operationsDoc) {
        return this.fetchGraphQL(
            operationsDoc,
            "MyMutation",
            {}
        );
    }

    async startExecuteMyMutation(operationsDoc) {
        const { errors, data } = await this.executeMyMutation(operationsDoc);

        if (errors) {
            // handle those errors like a pro
            throw new Error(errors[0].message);
        }

        // do something great with this precious data
        return data;
    }
}

export default new requester();
<script>
    import requester from "./utility/graphql-requester";
    import {query} from "./utility/queries";
    import { ApolloClient, InMemoryCache} from '@apollo/client';
    import { setClient, subscribe } from "svelte-apollo";
    import { WebSocketLink } from "@apollo/client/link/ws";


    function createApolloClient() {
        const wsLink = new WebSocketLink({
            uri: "wss://web3-app3.herokuapp.com/v1/graphql",
            options: {
                reconnect: true,
            }
        });
        const cache = new InMemoryCache();
        const client = new ApolloClient({
            link: wsLink,
            cache,
        });
        return client;
    }

    const client = createApolloClient();
    setClient(client);

    const storage = subscribe(query.getSub);

    const insertStorage = async () => {
        const name = prompt("Enter storage unit name:")
        const weight = prompt("Enter weight of storage unit in kg:")
        const volume = prompt("Enter volume of storage unit in m3:")
        if (!name||!weight||!volume){
            return
        }
        await requester.startExecuteMyMutation(query.Insert(name, weight, volume))
    }

    const deleteByVolume = async () => {
        const volume = prompt("Enter max volume in storage:")
        if (!volume){
            return
        }
        await requester.startExecuteMyMutation(query.DeleteBiggerThen(volume))
    }

</script>

<main>
    {#if $storage.loading}
        <div>loading ...</div>
    {:else if $storage.error}
        <div>Error!</div>
    {:else if $storage.data}
        <div>
            <button on:click={insertStorage}>Create new unit</button>
            <button on:click={deleteByVolume}>Delete unit</button>
            <table class="main-table">
                <caption>Storage</caption>
                <tr>
                    <th>Name</th>
                    <th>Weight kg</th>
                    <th>Volume m3</th>
                </tr>
            {#each $storage.data.web3_strogate as sd (sd.id)}
                <tr>
                    <td>{sd.name}</td>
                    <td>{sd.weight_kg}</td>
                    <td>{sd.volume_m3}</td>
                </tr>
            {/each}
            </table>
        </div>
    {/if}

</main>

<style>
    table, th, td, tr {
        border: 1px #000838 solid;
        background-color: #c3caff;
    }
    table {
        width: 100%;
    }
    caption {
        font-size: 35px;
        margin-bottom: 20px;
    }

</style>
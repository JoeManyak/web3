<script>
    import requester from "./utility/graphql-requester";
    import {query} from "./utility/queries";
    import {ApolloClient, InMemoryCache} from '@apollo/client';
    import {setClient, subscribe} from "svelte-apollo";
    import {WebSocketLink} from "@apollo/client/link/ws";

    console.log("CHECK THIS: " + HEROKU_URL)

    let name = ''
    let weight = ''
    let volume = ''

    let maxVolume = ''

    function clearAddInputs() {
        name = ''
        weight = ''
        volume = ''
    }

    function clearDeleteInputs() {
        maxVolume = ''
    }

    function createApolloClient() {
        const wsLink = new WebSocketLink({
            uri: HEROKU_URL,
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
        if (!name || !weight || !volume) {
            return
        }
        await requester.startExecuteMyMutation(query.Insert(name, weight, volume))
        clearAddInputs()
    }

    const deleteByVolume = async () => {
        if (!maxVolume) {
            return
        }
        await requester.startExecuteMyMutation(query.DeleteBiggerThen(maxVolume))
        clearDeleteInputs()
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
            <input placeholder="name" bind:value={name}>
            <input placeholder="weight_kg" bind:value={weight}>
            <input placeholder="volume_m3" bind:value={volume}>
            <br>
            <button on:click={deleteByVolume}>Delete unit</button>
            <input placeholder="max volume" bind:value={maxVolume}>
            <table class="main-table">
                <caption>Storage</caption>
                <tr>
                    <th>Name</th>
                    <th>Weight kg</th>
                    <th>Volume m3</th>
                </tr>
                {#if $storage.data.web3_strogate.length === 0}
                    <div>Empty database!</div>
                {:else}
                    {#each $storage.data.web3_strogate as sd (sd.id)}
                        <tr>
                            <td>{sd.name}</td>
                            <td>{sd.weight_kg}</td>
                            <td>{sd.volume_m3}</td>
                        </tr>
                    {/each}
                {/if}
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
import { RootState } from "@/redux/store";



/**
 * All servers
 */
export const selectServers = (state: RootState) => state.server.servers;


/**
 * Top 5 recently updated servers
 */

export const selectRecentServers = (state: RootState) =>
    [...state.server.servers]
        .sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        )
        .slice(0, 5);


/**
 * Online servers
 */

export const selectOnlineServers = (state: RootState) =>  state.server.servers.filter((server) => server.status === "online" );

/**
 * Loading state
 */
export const selectServerLoading = (state: RootState) =>  state.server.loading;

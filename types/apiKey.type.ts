export interface ApiKey {
          id:         Number
          name:       string
          key:        string
          revoked:    boolean;

          userId:     number;
          
          createdAt:  Date
          lastUsed:   Date | null
          status:     "active" | "revoked"
          
}

address 0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871 {
module Billboard {
    use aptos_framework::signer;

    /// A single billboard resource stored under the owner's account.
    struct Billboard has key {
        owner: address,
        message: vector<u8>,
    }

    /// Initialize the billboard under the caller's account with an initial message.
    public entry fun initialize(account: &signer, initial_message: vector<u8>) {
        let owner = signer::address_of(account);
        let billboard = Billboard { owner, message: initial_message };
        move_to(account, billboard);
    }

    /// Set a new message. Only the owner (the account where the resource is stored) may set the message.
    public fun set_message(account: &signer, new_message: vector<u8>) acquires Billboard {
        let owner = signer::address_of(account);
        let b = borrow_global_mut<Billboard>(owner);
        // Check ownership - resource should be stored under owner's address
        if (b.owner != owner) {
            // unauthorized
            abort 1;
        };
        b.message = new_message;
    }

    /// Read the message stored at `owner`'s account.
    public fun get_message(owner: address): vector<u8> acquires Billboard {
        let billboard_ref = borrow_global<Billboard>(owner);
        billboard_ref.message
    }

    /// Script entrypoint to set the message (callable from transaction).
    public entry fun set_message_script(account: &signer, new_message: vector<u8>) {
        set_message(account, new_message);
    }

    /// Script entrypoint to read a message for `target` address.
    /// Note: scripts generally don't return values to the CLI; use this for composition or tests.
    public entry fun read_message_script(_account: &signer, target: address) {
        let _m = get_message(target);
    }
}
}

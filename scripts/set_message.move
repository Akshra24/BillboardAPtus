script {
    use 0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871::Billboard;

    fun set_message_main(account: signer, new_message: vector<u8>) {
        Billboard::set_message_script(&account, new_message);
    }
}

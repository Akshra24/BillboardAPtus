script {
    use 0x0b934d8296093a01ce424e530172908aefde114f1f9750a655573447fe5a9871::Billboard;

    fun read_message_main(_account: signer, target_address: address) {
        Billboard::read_message_script(&_account, target_address);
    }
}
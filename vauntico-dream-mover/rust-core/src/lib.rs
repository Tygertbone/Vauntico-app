use sha2::{Digest, Sha256};

// NOTE: This is a POC. Full MigrationDriver functions to be exported in a future neon/N-API binding.
// The exported function below remains safe and side-effect free for dry-run testing.

#[no_mangle]
pub extern "C" fn dm_hash_str(input: *const u8, len: usize) -> *mut u8 {
    // POC: hash input bytes and return hex string as heap-allocated C string
    if input.is_null() { return std::ptr::null_mut(); }
    let slice = unsafe { std::slice::from_raw_parts(input, len) };
    let mut hasher = Sha256::new();
    hasher.update(slice);
    let result = hasher.finalize();
    let hex = hex::encode(result);
    let mut bytes = hex.into_bytes();
    bytes.push(0);
    let ptr = bytes.as_mut_ptr();
    std::mem::forget(bytes);
    ptr
}

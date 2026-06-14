use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
struct Counter {
    count: u32,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
enum InstructionData {
    Increase,
    Decrease,
}

fn main() {
    let data = vec![0u8; 4];
    let counter = Counter::try_from_slice(&data);
    println!("Counter from [0,0,0,0]: {:?}", counter);

    let idata = vec![0u8];
    let instr = InstructionData::try_from_slice(&idata);
    println!("Instr from [0]: {:?}", instr);
}

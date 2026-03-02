let hash = '';

export const hasher = {
    name: 'hasher',
    store() {
        return {
            hash: null,
            init() {
            },
            setHash(val){
                console.log('Hashing secret: ' + val);
                hash = val;
                return hash;
            },
            getHash(){
                console.log('Hash retrieved');
                return hash;
            },
            dispatchHash(){
                let hashEv = new Event('hash', { bubbles: true });
                dispatchEvent(hashEv);
            },
        }
    }
}
export default hasher;

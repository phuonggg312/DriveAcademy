export default {
    name: 'instagram',
    component() {
        return {
            feed_id: "",
            init() {
                let instagramScript = document.createElement('script');
                instagramScript.setAttribute('src', '//foursixty.com/media/scripts/fs.embed.v2.5.js')
                instagramScript.setAttribute('data-feed-id', this.feed_id)
                instagramScript.setAttribute('data-theme', 'sizes_v2_5')
                instagramScript.setAttribute('data-page-size', this.imgCount)
                instagramScript.setAttribute('data-connector-filter', '10344,20688,36613,36611,36811')

                document.querySelector('.ig-feed_content').appendChild(instagramScript)
            },
            initProduct(){
                let instagramScript = document.createElement('script');
                instagramScript.setAttribute('src', '//foursixty.com/media/scripts/fs.slider.v2.5.js')
                instagramScript.setAttribute('data-feed-id', this.feed_id)
                instagramScript.setAttribute('data-theme', 'slider_v2_5')
                instagramScript.setAttribute('data-cell-size', '20%')
                instagramScript.setAttribute('data-for-url', true)
                document.querySelector('.product-instagram').appendChild(instagramScript)

                setTimeout(() => {
                    let checkInsta = setInterval(() => {
                        let instagramPosts = document.querySelector('.product-instagram .fs-timeline');
                        if(instagramPosts){
                            if(instagramPosts.childNodes.length > 0) {
                                this.instagramHasPosts = true
                            }
                            clearInterval(checkInsta);
                        }
                    },1000);
                }, 1000)
            }
        }
    }
}


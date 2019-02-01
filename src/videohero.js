/**
 * VideoHero.js
 * Developed by Jesus Magallon
 * Email: jesus@yosoydev.net
 * GitHub: https://github.com/jesus997/VideoHero.js
 * License: GNU General Public License v3.0
 */
(function($) {
    class VideoHero {
        constructor($el, settings={}) {
            this.$el = $el;
            this.settings = $.extend({
                provider: "youtube",
                videoid: "",
                poster: "",
                log: false,
                api: {
                    url: "https://you-link.herokuapp.com/",
                    param: "?url=https://www.youtube.com/watch?v="
                },
                attrs: {
                    muted: true,
                    autoplay: true,
                    loop: true,
                },
                classes: {
                    container: {
                        wrapper: "videohero videohero-wrapper",
                        preparing: "preparing",
                        ready: "ready",
                        error: "error",
                        provider: "videohero-provider-"
                    },
                    video: "videohero-element"
                }
            }, settings);

            this.log("VideoHero has successfully initialized with the following configuration:");
            this.log(this.settings);

            this.generate();
        }

        get api_url() {
            return this.settings.api.url + this.settings.api.param + this.settings.videoid;
        }

        log(msg) {
            if(this.settings.log) {
                if(typeof msg === "object") {
                    console.log(msg);
                } else {
                    console.log("[VideoHero] " + msg);
                }
            }
        }

        error(msg) {
            if(this.settings.log) {
                if(typeof msg === "object") {
                    console.error(msg);
                } else {
                    console.error("[VideoHero] " + msg);
                }
            }
        }

        getDataFromEl() {
            var el = this.$el;
            var s = this.settings;
            $.each(this.settings, function(i, v) {
                if(el.is("[data-" + i + "]")) {
                    s[i] = el.data(i);
                }
            });
            this.settings = s;
        }

        setSourcesFromYoutube(videoTag) {
            var $this = this;
            this.log("Starting extraction of YouTube sources.");
            $.ajax({
                method: "POST",
                url: this.api_url
            }).done(function( data ) {
                if(data.length > 0) {
                    if(typeof data[0].error === "undefined") {
                        $this.log("Complete extraction. " + data.length + " sources were found.");
                        $this.log(data);
                        $.each(data, function(i, v) {
                            videoTag.append($("<source></source>").attr("src", v.url)
                            .attr("type", v.type));
                        });
                    } else {
                        $this.log("API error: " + data[0].reason);
                        $this.log($this.api_url);
                    }
                } else {
                    $this.log("No sources found for this video.");
                }
            }).fail(function() {
                $this.error("The extraction of sources has failed. Verify the API address: " + this.api_url);
            });
        }

        generateWrapperTag() {
            this.getDataFromEl();
            var tag = $("<div></div>"), clasess="";
            if(this.$el.is("[id]")) {
                tag.attr("id", this.$el.attr("id"));
            }
            if(this.$el.is("[class]")) {
                tag.attr("class", this.$el.attr("class"));
            }
            clasess += this.settings.classes.container.wrapper;
            clasess += " " + this.settings.classes.container.preparing;
            clasess += " " + this.settings.classes.container.provider + this.settings.provider;
            tag.addClass(clasess);
            this.log("Wrapper generated successfully.");
            return tag;
        }

        generateVideoTag() {
            var tag = $("<video></video>").addClass(this.settings.classes.video);
            $.each(this.settings.attrs, function(i, v) {
                if(i === "autoplay") {
                    v = "";
                    tag.attr("plays-inline", v).attr("playsinline", v);
                }
                if(i === "loop") v = "";
                tag.attr(i, v);
            });
            tag.attr("poster", this.settings.poster);
            this.log("Video Tag generated successfully.");
            return tag;
        }

        generate() {
            var wrapper = this.generateWrapperTag(),
                video = this.generateVideoTag();
            if(this.settings.provider.toLowerCase() === "youtube") {
                this.setSourcesFromYoutube(video);
            }

            if($(video).children().length > 0) {
                wrapper.removeClass(this.settings.classes.container.preparing)
                    .addClass(this.settings.classes.container.ready);
            } else {
                wrapper.removeClass(this.settings.classes.container.preparing)
                    .addClass(this.settings.classes.container.ready);
            }

            if(this.settings.attrs.muted) {
                if(typeof video.get(0).muted !== "undefined") video.get(0).muted = true;
            }

            if(this.settings.attrs.autoplay) {
                var playPromise = video.get(0).play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        this.log("Playing video successfully.");
                    }).catch(error => {
                        this.error("The video could not be played.");
                    });
                }
            }

            wrapper.html(video);
            this.$el.replaceWith(wrapper);
            this.log("Injection of the video complete.");
        }
    }

    $.fn.videohero = function(options) {
        return this.each(function() {
            new VideoHero($(this), options);
        });
    }    
})(jQuery);
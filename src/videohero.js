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
                source: "",
                type:"video/mp4",
                poster: "",
                log: false,
                api: {
                    url: "http://youlink.epizy.com/",
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
                    video: "videohero-element",
                    buttons: {
                        mute: {
                            self: "videohero-mute-button",
                            on: "sound-off",
                            off: "sound-on"
                        }
                    }
                },
                i18n: {
                    "mute": "Sound off",
                    "unmute": "Sound on"
                }
            }, settings);

            this.log("VideoHero has successfully initialized with the following configuration:");
            this.log(this.settings);
            
            this.generate();
        }

        isJson(item) {
            item = typeof item !== "string" ? JSON.stringify(item) : item;
            try {
                item = JSON.parse(item);
            } catch (e) {
                return false;
            }
            if (typeof item === "object" && item !== null) {
                return true;
            }
            return false;
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

            if(this.settings.poster === "" && this.settings.provider === "youtube") {
                this.settings.poster = "https://i.ytimg.com/vi/"+this.settings.videoid+"/maxresdefault.jpg";
            }
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

        setSourcesFromCustom(videoTag) {
            if(this.settings.source !== "") {
                if(this.isJson(this.settings.source)) {
                    $.each(this.settings.source, function(i, v) {
                        var s = typeof v.source !== "undefined" ? v.source : false;
                        var t = typeof v.type !== "undefined" ? v.type : false;
                        if(s) {
                            var f = $("<source></source>").attr("src", s);
                            if(t) {
                                f.attr("type", t);
                            }
                            videoTag.append(f);
                        }
                    });
                } else {
                    videoTag.append($("<source></source>").attr("src", this.settings.source)
                    .attr("type", this.settings.type));
                }
            }
        }

        generateWrapperTag() {
            this.getDataFromEl();
            var clasess="";
            clasess += this.settings.classes.container.wrapper;
            clasess += " " + this.settings.classes.container.preparing;
            clasess += " " + this.settings.classes.container.provider + this.settings.provider;
            this.$el.addClass(clasess);
            this.$el.css("background-image", "url("+this.settings.poster+")");
            this.log("Wrapper generated successfully.");
        }

        generateMuteButton() {
            return $("<button></button>")
            .addClass(this.settings.classes.buttons.mute.self)
            .addClass(this.settings.classes.buttons.mute.off)
            .attr("aria-label", this.settings.i18n.mute);
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

        toggleMute(video, btn, force=false) {
            if(typeof video.get(0).muted !== "undefined"){
                if(!video.get(0).muted || force) {
                    video.get(0).muted = true;
                    btn.removeClass(this.settings.classes.buttons.mute.on)
                    .addClass(this.settings.classes.buttons.mute.off)
                    .attr("aria-label", this.settings.i18n.mute);
                } else {
                    video.get(0).muted = false;
                    btn.removeClass(this.settings.classes.buttons.mute.off)
                    .addClass(this.settings.classes.buttons.mute.on)
                    .attr("aria-label", this.settings.i18n.unmute);
                }
            }
        }

        generate() {
            this.generateWrapperTag();
            var video = this.generateVideoTag();
            var bMute = this.generateMuteButton();
            if(this.settings.provider.toLowerCase() === "youtube") {
                this.setSourcesFromYoutube(video);
            } else if(this.settings.provider.toLowerCase() === "custom") {
                this.setSourcesFromCustom(video);
            }

            if($(video).children().length > 0) {
                this.$el.removeClass(this.settings.classes.container.preparing)
                    .addClass(this.settings.classes.container.ready);
            } else {
                this.$el.removeClass(this.settings.classes.container.preparing)
                    .addClass(this.settings.classes.container.ready);
            }

            if(this.settings.attrs.muted) {
                this.toggleMute(video, bMute, true);
            }

            var $this = this;
            $(bMute).on("click", function() {
                $this.toggleMute(video, bMute);
            });

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

            this.$el.html(video);
            this.$el.prepend(bMute);
            this.log("Injection of the video complete.");
        }
    }

    $.fn.videohero = function(options) {
        return this.each(function() {
            new VideoHero($(this), options);
        });
    }
})(jQuery);

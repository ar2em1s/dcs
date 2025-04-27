module Jekyll
  class InlineJsTag < Liquid::Tag
    def initialize(_, path_to_atf_js, _)
      super
      path_to_atf_js = File.expand_path(path_to_atf_js.delete('"').strip)
      @atf_js_raw = File.read(path_to_atf_js)
    end

    def render(_)
      "<script type=\"text/javascript\">#{@atf_js_raw}</script>"
    end
  end
end

Liquid::Template.register_tag(:inline_js, Jekyll::InlineJsTag)

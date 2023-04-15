module Jekyll
  Jekyll::Hooks.register :site, :after_init do |data|
    puts("Generating gfidget npm")
    Dir.chdir('gfidget/source'){
      puts(`npm run build`)
    }
  end
end

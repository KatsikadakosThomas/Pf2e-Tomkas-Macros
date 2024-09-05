// Helper function to dynamically load JS files from the macros directory
async function loadMacro(fileName) {
    try {
      // Dynamically import the macro file
      const macroModule = await import(`../macros/${fileName}`);
  
      // You can modify how to register macros based on your macro structure.
      // Assuming the macro file exports a 'default' function or object:
      if (macroModule.default) {
        console.log(`Registering macro: ${fileName}`);
        
        // Register the macro in Foundry
        game.macros.register(fileName.replace('.js', ''), fileName, macroModule.default);
      }
    } catch (error) {
      console.error(`Failed to load macro ${fileName}:`, error);
    }
  }
  
  // Function to load all macros in the macros directory
  async function loadAllMacros() {
    const macroFiles = [
      'magicMissile.js',
      'wellspringSurge.js'
      // Add more file names or use a more dynamic method (see below)
    ];
  
    for (const fileName of macroFiles) {
      await loadMacro(fileName);
    }
  }
  
  // Hook into the 'ready' event to load macros when Foundry is ready
  Hooks.once('ready', async () => {
    console.log("My Macro Module is ready!");
  
    // Load all macros from the directory
    await loadAllMacros();
  });
class PCM16Processor extends AudioWorkletProcessor {
    process(inputs) {
      const input = inputs[0][0];
      if (!input) return true;
  
      const pcm16 = new Int16Array(input.length);
  
      for (let i = 0; i < input.length; i++) {
        let s = Math.max(-1, Math.min(1, input[i]));
        pcm16[i] = s * 32767;
      }
  
      this.port.postMessage(pcm16);
  
      return true;
    }
  }
  
  registerProcessor("pcm16-processor", PCM16Processor);
  
import { commands } from '../config/commands';

class DialogService {
  constructor() {
    this.commandPatterns = this.buildCommandPatterns();
  }

  buildCommandPatterns() {
    // Common action words that might precede our commands
    const actionPrefixes = [
      'please',
      'can you',
      'could you',
      'would you',
      'i want to',
      'i\'d like to',
      'i need to',
      'help me'
    ];

    // Common filler words that might appear in commands
    const fillerWords = [
      'the',
      'a',
      'an',
      'this',
      'that',
      'to',
      'for',
      'on',
      'in',
      'at'
    ];

    // Build regex patterns for each command
    return commands.map(cmd => {
      const prefixPattern = actionPrefixes.join('|');
      const fillerPattern = fillerWords.join('|');
      
      // Create pattern that matches the command with optional prefixes and filler words
      const pattern = new RegExp(
        `^(?:(?:${prefixPattern})\\s+)?` + // Optional action prefix
        `(?:${fillerPattern}\\s+)?` +      // Optional filler words
        `(${cmd.trigger})\\s*` +           // The actual command trigger
        `(.*)$`,                           // The rest of the command (parameters)
        'i'                                // Case insensitive
      );

      return {
        ...cmd,
        pattern
      };
    });
  }

  interpretCommand(text) {
    // Clean up the input text
    const cleanText = text.trim().toLowerCase();
    
    // Try to match the input against our command patterns
    for (const cmd of this.commandPatterns) {
      const match = cleanText.match(cmd.pattern);
      if (match) {
        const [, trigger, paramText] = match;
        const param = cmd.extractParam ? cmd.extractParam(paramText.trim()) : null;
        
        return {
          command: cmd,
          params: param ? [param] : [],
          confidence: this.calculateConfidence(cleanText, cmd),
          original: text
        };
      }
    }

    // If no direct match, try fuzzy matching
    return this.findSimilarCommand(cleanText);
  }

  calculateConfidence(text, command) {
    // Base confidence for exact matches
    if (text.includes(command.trigger)) {
      return 1.0;
    }

    // Calculate similarity score
    const similarity = this.calculateSimilarity(text, command.trigger);
    return similarity;
  }

  calculateSimilarity(str1, str2) {
    // Simple Levenshtein distance-based similarity
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (distance / maxLength);
  }

  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],     // deletion
            dp[i][j - 1],     // insertion
            dp[i - 1][j - 1]  // substitution
          );
        }
      }
    }

    return dp[m][n];
  }

  findSimilarCommand(text) {
    // Find commands with similar triggers
    const similarities = this.commandPatterns.map(cmd => ({
      command: cmd,
      similarity: this.calculateSimilarity(text, cmd.trigger)
    }));

    // Sort by similarity
    similarities.sort((a, b) => b.similarity - a.similarity);

    // If best match has good enough similarity, suggest it
    if (similarities[0].similarity > 0.6) {
      return {
        command: similarities[0].command,
        params: [],
        confidence: similarities[0].similarity,
        original: text,
        suggestion: true
      };
    }

    // Extract potential action words
    const words = text.split(/\s+/);
    const actionWords = words.filter(word => 
      ['click', 'go', 'scroll', 'type', 'search', 'open', 'close', 'play'].includes(word)
    );

    if (actionWords.length > 0) {
      // Find commands that might match the action words
      const potentialCommands = this.commandPatterns.filter(cmd =>
        actionWords.some(word => cmd.trigger.includes(word))
      );

      if (potentialCommands.length > 0) {
        return {
          command: potentialCommands[0],
          params: [text], // Pass full text as parameter
          confidence: 0.5,
          original: text,
          suggestion: true
        };
      }
    }

    // No good match found
    return {
      command: null,
      confidence: 0,
      original: text,
      error: 'Command not recognized'
    };
  }

  suggestCommand(text) {
    const interpretation = this.interpretCommand(text);
    
    if (interpretation.command) {
      if (interpretation.confidence >= 0.8) {
        return {
          type: 'EXECUTE',
          message: `Executing: ${interpretation.command.description}`,
          action: interpretation.command.action,
          params: interpretation.params
        };
      } else if (interpretation.confidence >= 0.6) {
        return {
          type: 'CONFIRM',
          message: `Did you mean: ${interpretation.command.example}?`,
          action: interpretation.command.action,
          params: interpretation.params
        };
      }
    }

    // Find similar commands for suggestions
    const similarCommands = this.commandPatterns
      .map(cmd => ({
        command: cmd,
        similarity: this.calculateSimilarity(text, cmd.trigger)
      }))
      .filter(item => item.similarity > 0.4)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    if (similarCommands.length > 0) {
      return {
        type: 'SUGGEST',
        message: 'Did you mean one of these?',
        suggestions: similarCommands.map(item => ({
          example: item.command.example,
          description: item.command.description
        }))
      };
    }

    return {
      type: 'ERROR',
      message: 'I didn\'t understand that command. Try something like: ' +
               this.commandPatterns[Math.floor(Math.random() * this.commandPatterns.length)].example
    };
  }
}

export default DialogService;

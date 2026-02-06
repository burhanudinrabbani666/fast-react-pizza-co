# Reusing styles

not recommend

```css
@layer components {
  .input {
    @apply w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-200 focus:ring focus:ring-yellow-300 focus:outline-none md:px-6 md:py-2;
  }
}
```

Next: [Reusing style components](./22-reusing-style-components.md)

class Cleaner:
    """Clean and normalize tender text before chunking."""

    def clean(self, text: str) -> str:
        return "\n".join(line.strip() for line in text.splitlines() if line.strip())

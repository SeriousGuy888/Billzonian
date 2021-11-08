---
title: Plans
nav_order: 6
---

# Plans & Progress

-----
### Goals
> <span class="label label-green">Reached</span>
> Change the grammar & word order around to not be too much like English

> <span class="label label-yellow">In Progress</span>
> Coin new major vocabulary words (those being nouns and verbs) and have
> enough to replace most English words in regular speech with newly coined Billzonian words.

> <span class="label label-yellow">In Progress</span>
> Implement vowel shifts and sound changes

> <span class="label label-yellow">In Progress</span>
> End mutual intelligibility between Billzonian and English
> and maybe use it as a secret language idk

-----
### Posts

{% for post in site.categories.plans %}
  <p>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a> <small><em>{{ post.date | date: "%Y-%m-%d" }}</em></small>
    <br>
    <small>{{ post.content | strip_html | truncatewords:50 }}</small>
  </p>
{% endfor %}
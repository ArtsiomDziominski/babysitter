<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-1">
      <UContainer>
        <slot />
      </UContainer>
    </main>
    <Footer />
  </div>
</template>


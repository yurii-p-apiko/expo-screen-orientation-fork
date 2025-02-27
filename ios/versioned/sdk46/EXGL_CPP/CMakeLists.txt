cmake_minimum_required(VERSION 3.4.1)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_ANDROID_STL_TYPE c++_shared)
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

set(PACKAGE_NAME "expo-gl")
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)

add_library(
    ${PACKAGE_NAME} SHARED
    ./ABI46_0_0EXGL.cpp
    ./ABI46_0_0EXGL.h
    ./ABI46_0_0EXGLImageUtils.cpp
    ./ABI46_0_0EXGLImageUtils.h
    ./ABI46_0_0EXGLContext.cpp
    ./ABI46_0_0EXGLContext.h
    ./ABI46_0_0EXGLContextManager.cpp
    ./ABI46_0_0EXGLContextManager.h
    ./ABI46_0_0EXWebGLMethods.cpp
    ./ABI46_0_0EXWebGLMethods.h
    ./ABI46_0_0EXWebGLRenderer.cpp
    ./ABI46_0_0EXWebGLRenderer.h
    ./ABI46_0_0EXTypedArrayApi.cpp
    ./ABI46_0_0EXTypedArrayApi.h
    ./ABI46_0_0EXGLJniApi.cpp)

# Extracted AAR: ${BUILD_DIR}/react-native-0*/jni/${ANDROID_ABI}
file(GLOB LIBRN_DIR "${RN_SO_DIR}/${ANDROID_ABI}")
if(NOT LIBRN_DIR)
    # If /${ANDROID_ABI} dir not found, then ${RN_SO_DIR} is probably:
    # ABI46_0_0ReactAndroid/build/react-ndk/exported
    file(GLOB LIBRN_DIR "${RN_SO_DIR}")
endif()

target_include_directories(${PACKAGE_NAME}
                           PRIVATE "${REACT_NATIVE_DIR}/ReactCommon/jsi")

find_library(
    JSI_LIB jsi
    PATHS ${LIBRN_DIR}
    NO_CMAKE_FIND_ROOT_PATH)

find_library(LOG_LIB log)
find_library(GLES_LIB GLESv3)

target_compile_options(
    ${PACKAGE_NAME}
    PRIVATE -O2
            -fexceptions
            -frtti
            -Wall
            -Wextra
            -Wno-unused-parameter
            -Wshorten-64-to-32
            -Wstrict-prototypes)
target_link_libraries(${PACKAGE_NAME} ${JSI_LIB} ${LOG_LIB} ${GLES_LIB} android)
